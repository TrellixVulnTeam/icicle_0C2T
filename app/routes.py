import math
import os
import secrets
from math import isclose

from PIL import Image
from flask import render_template, url_for, flash, redirect, request, jsonify
import psycopg2

from app import app, db, bcrypt
from app.forms import RegistrationForm, LoginForm, UpdateAccountForm
from app.models import User, Roads
from flask_login import login_user, current_user, logout_user, login_required
from app.findRoads import roads

"""
posts = [
    {
        'author': 'Corey Schafer',
        'title': 'Blog Post 1',
        'content': 'First post content',
        'date_posted': 'April 20, 2018'
    }
]

"""

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')


@app.route("/about")
def about():
    return render_template('about.html', title='About')

@app.route("/whatis")
def whatis():
    return render_template('whatis.html', title='What Is ICICLE?')

@app.route('/map.html', methods = ['POST', 'GET'])
def map():
    if request.method == 'GET':
        return render_template('map.html')
    else:
        d = request.get_json()
        # print(d)
        d = d['geometry']['coordinates']
        null = "null"

        returnCollection = []

        currentSum = 3
        currentFeature = null

        if(d[0] == 0):
            for index in range(len(roads['features'])):
                if (roads['features'][index]['properties']['SNOWLEVEL'] != 0):
                    returnCollection.append(roads['features'][index])

            return jsonify(returnCollection)
        else:


            for index in range(len(roads['features'])):
                points=roads['features'][index]['geometry']['coordinates'][0]
                for point in points:
                    if (isclose(point[1], d[0], abs_tol=3e-4) and (isclose(point[0], d[1], abs_tol=3e-4))):
                        sum = math.fabs(point[1] - d[0]) + math.fabs(point[0] - d[1])
                        if (sum < currentSum):
                            currentSum = sum
                            currentFeature = roads['features'][index]
                        break

            returnCollection.append(currentFeature)
            if ((currentFeature != null) and (currentFeature['properties']['GATENAVN'] != '')):
                for index in range(len(roads['features'])):
                    if (roads['features'][index]['properties']['GATENAVN']) == (currentFeature['properties']['GATENAVN']):
                        returnCollection.append(roads['features'][index])

            return jsonify(returnCollection)

@app.route('/snow', methods = ['POST'])
def snow():
    d = request.get_json()

    returnCollection = []
    returnCollection.append(d)
    # roads[properties][SNOWLEVEL] =
    for index in range(len(roads['features'])):
        if (roads['features'][index]['properties']['GATENAVN']) == (d['properties']['GATENAVN']):
            roads['features'][index]['properties']['SNOWLEVEL'] = d['properties']['SNOWLEVEL']

            returnCollection.append(roads['features'][index])

    return jsonify(returnCollection)


@app.route("/register", methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You are now able to log in', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        print("" + user.password + "\n")
        if user and bcrypt.check_password_hash(user.password, form.password.data.encode('utf-8')):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form)


@app.route("/logout")
def logout():
    logout_user()
    return redirect(url_for('home'))


def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(app.root_path, 'app/static/profile_pics', picture_fn)

    output_size = (125, 125)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)

    return picture_fn


@app.route("/account", methods=['GET', 'POST'])
@login_required
def account():
    form = UpdateAccountForm()
    if form.validate_on_submit():
        if form.picture.data:
            picture_file = save_picture(form.picture.data)
            current_user.image_file = picture_file
        current_user.username = form.username.data
        current_user.email = form.email.data
        db.session.commit()
        flash('Your account has been updated!', 'success')
        return redirect(url_for('account'))
    elif request.method == 'GET':
        form.username.data = current_user.username
        form.email.data = current_user.email
    image_file = url_for('static', filename='profile_pics/' + current_user.image_file)
    return render_template('account.html', title='Account',
                           image_file=image_file, form=form)

#populate table in db
@app.route('/populate')
def populate():
    with open('app/roads/centre_roads.txt') as f:
        obj_list = []
        for chunk in each_chunk(f, '$'):
            obj_list.append(chunk)
        try:
            conn = psycopg2.connect(user="gsfobcmjlmajvm", database="de7ro6upkbhjrp",
                                    password="20d5a5c82d93efff5985528b5f7f3f3b28d57134b369a9ba22217c79aaefb76c", host="ec2-46-137-113-157.eu-west-1.compute.amazonaws.com", port="5432")
            print("succesfully connected to DB")
            cur = conn.cursor()

            for item in obj_list:
                print(item)
                cur.execute("""INSERT INTO roads(json_field)
                            VALUES(%s)""",
                            (item,))
                print(".")

        except psycopg2.Error as e:
            raise

        finally:
            conn.commit()
            print("commit ok")
            return ""


def each_chunk(stream, delim):
    print("brrrrrrrrrrrrrap")
    buffer = ''
    while True:
        chunk = stream.read(4096)
        if not chunk:
            yield buffer
            break
        buffer += chunk
        while True:
            try:
                part, buffer = buffer.split(delim, 1)
                #print(buffer)
            #                print(part)
            except ValueError:
                break
            else:
                yield part
