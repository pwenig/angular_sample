require 'rails_helper'

RSpec.feature 'Admin', type: :feature do
  before do
    visit('/')
    @admin = User.create(email: 'admin@admin.com', password: 'password', admin: true)
    @user = User.create(email: 'user@user.com', password: 'password')
  end

  it 'logs in an admin user' do
    fill_in('email-login', with: @admin.email)
    fill_in('password-login', with: @admin.password)
    click_on('Log In')
    expect(current_path).to eq(admin_root_path)
  end

  it 'redirects a non-admin user' do
    fill_in('email-login', with: @user.email)
    fill_in('password-login', with: @user.password)
    click_on('Log In')
    expect(current_path).to_not eq(admin_root_path)
    expect(current_path).to eq(root_path)
    visit('/admin')
    expect(page).to have_text('You are not authorized to access this page.')
  end
end