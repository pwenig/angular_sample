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
    User.create(email: email, password: password, admin: true, agency_id: 1)
    puts 'User created'
    puts 'COMPLETE: admin:create_user'
  end
end
