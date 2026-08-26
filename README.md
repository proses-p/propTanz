# property Management platform

A modern propert management platform for managing and discovering different types of properties and assests.
The platform is designed to manage and support multiple modules, including

- Hostel management
- Land management
- Apartment management
- Future property and asset management modules

## current modules

### Hostel management

The hostel module allows users to:

- Register and login
- Requestowner verification
- Submit hostel ownership verification
- Track verification status
- Register hostels after approval
- Manage registered hostels
- Search and filter hostels
- Upload hostel images
- Edit and delete hostels

### Admin features

Administrators can:

- manage users
- review owner verification requests
- approve owner requests
- reject owner requests
- manage registered hostels
- approv or reject hostels

## technology stack

### frontend

- react
- vite
- tailwind css
- axios
- react router
- react toastify

### backend

- laravel
- php
- mysql
- laravel sanctum

## installation
git clone .....
## backend setup

cd ...
composer install
cp .env.example .env

## run the following
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve

## frontend setup
cd ..
npm install
npm run dev


