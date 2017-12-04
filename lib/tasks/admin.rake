require 'io/console'
namespace :admin do
  task create_user: :environment do
    puts 'START: admin:create_user'
    puts ''
    puts 'Enter your email address:'
    email = STDIN.gets.chomp

    raise 'The user already exists.' if User.exists?(email: email)

    puts "Hello #{email}. Enter your password"
    password = STDIN.noecho(&:gets).chomp
    User.create!(email: email, password: password, admin: true, agency_id: 1)
    puts 'User created'
    puts 'COMPLETE: admin:create_user'
  end

  task change_password: :environment do
    puts 'START: admin:change_password'
    puts ''
    puts 'Enter your email address:'
    email = STDIN.gets.chomp

    user = User.find_by(email: email)

    raise 'The user does not exist.' unless user

    puts "Hello #{email}. Enter your new password"
    password = STDIN.noecho(&:gets).chomp

    user.password = password
    user.save!
    puts 'User password updated.'
    puts 'COMPLETE: admin:change_password'
  end
end
