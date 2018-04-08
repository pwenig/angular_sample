# Viacom Media Tagging Project

* Rails v5.1 / Ruby v2.4
* Database - PostgreSQL

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

* To import all initial data:
  * $rake import:all

* To clear and reset all initial data (except Users and Agencies)
  * $rake import:reset

* To import initial network data:
  * $rake import:networks

* To import initial program data (after network data):
  * $rake import:programs

* To import initial season data:
  * $rake import:seasons

* To import initial campaign type data:
  * $rake import:campaign_types

* To import initial buy methods data:
  * $rake import:buy_methods

* To import initial publisher data:
  * $rake import:publishers

* To import initial agencies:
  * $rake import:agencies

* To import initial inventory types data:
  * $rake import:inventory_types

* To import initial tactics data:
  * $rake import:tactics

* To import initial devices data:
  * $rake import:devices

* To import initial ad_types data:
  * $rake import:ad_types

* To import initial episodes data:
  * $rake import:episodes

* To import initial targeting types data:
  * $rake import:targeting_types

* To import initial creative groups data:
  * $rake import:creative_groups

* To import initial creative messages data:
  * $rake import:creative_messages

* To import initial ab test labels data:
  * $rake import:abtest_labels

* To import initial video lengths data:
  * $rake import:video_lengths

* To enable email invitations, add ENV variables:
  * EMAIL_ADDRESS
  * EMAIL_PASSWORD

* To enable S3 exporting, add ENV variables:
  * AWS_ACCESS_KEY
  * AWS_SECRET_KEY
  * BUCKET
  * DIRECTORY_NAME
  * REGION

* To export namestrings to S3:
  * $rake export:namestrings

* Rubocop
  * rubocop -a
    The -a option will automatically update some errors. Please see the
    .rubocop.yml file for settings to ignore or alter cop rules.

* Staging site:
  * http://viacom.stage.services.visual4site.tech/
