require 'rails_helper'

RSpec.describe User, type: :model do
  it 'creates a user' do
    user = User.create(email: 'test@test.com', password: 'password', admin: true)
    expect(user.email).to include('test@test.com')
    expect(user.admin).to be(true)
  end

  it 'should belong to an agency' do
    should belong_to(:agency)
  end
end
