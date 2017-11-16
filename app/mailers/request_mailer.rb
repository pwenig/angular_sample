class RequestMailer < ApplicationMailer
  def request_email(recipient, sender, request_detail)
    mail(to: recipient,
         subject: 'Naming Convention Value Request',
         from: sender) do |format|
      format.html do
        render locals: { detail: request_detail }
      end
      format.text do
        render locals: { detail: request_detail }
      end
    end
  end
end
