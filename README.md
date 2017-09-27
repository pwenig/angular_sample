# Viacom Media Tagging Project

* Rails v5.1 / Ruby v2.4
* Database - Production is current set to PostgreSQL. Dev is set to SQLite.

* To run locally:
  * Git clone repo
  * $bundle install
  * $rake db:create
  * $rake db:migrate
  * $bundle exec foreman start -f Procfile.dev
  * http://localhost:5000/

* To run RSpec tests:
  * $bundle exec rspec

* To create the initial admin user:
  * $rake admin:create_user

* To enable email invitations, add ENV variables:
  * EMAIL_ADDRESS
  * EMAIL_PASSWORD

* Rubocop
  * rubocop -a
    The -a option will automatically update some errors. Please see the
    .rubocop.yml file for settings to ignore or alter cop rules.

* Temp staging site:
  * https://vmtapp.herokuapp.com/
