require 'rails_helper'

RSpec.describe 'User Invite', type: :mailer do
  describe 'invite' do
    let(:mail) { User.invite!(email: 'foo@foo.com') }

    it 'renders the headers' do
      expect(mail.email).to eq('foo@foo.com')
    end
  end
end
