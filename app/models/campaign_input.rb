class CampaignInput < ApplicationRecord
  belongs_to :program
  belongs_to :network
  belongs_to :season
  belongs_to :campaign_type
end
