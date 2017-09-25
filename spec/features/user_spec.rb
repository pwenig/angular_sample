require 'rails_helper'

RSpec.feature 'User', type: :feature do
  before do
    visit('/')
    @user = User.create(email: 'user1@user.com', password: 'password')
  end

  it 'registers and signs in a new user' do
    click_on('signup-link')
    fill_in('email', with: 'user@user.com')
    fill_in('password', with: 'password')
    fill_in('password_confirmation', with: 'password')
    click_on('Sign up')
    expect(page).to have_text('Logged In User')
  end

  it 'logs in an existing user' do
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    expect(page).to have_text('Logged In User')
  end

  it 'logs out a user' do
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    click_on('Log Out')
    expect(page).to_not have_text('Logged in User')
    expect(page).to have_text('Signed out successfully.')
  end
end
