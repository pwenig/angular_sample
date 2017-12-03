require 'rails_helper'

RSpec.describe 'User Invite', type: :mailer do
  describe 'invite' do
    let(:mail) do
      User.invite!(email: 'foo@foo.com', agency: Agency.create!(name: 'Foo', abbrev: 'foo'))
    end

    it 'renders the headers' do
      expect(mail.email).to eq('foo@foo.com')
    end
  end
end
