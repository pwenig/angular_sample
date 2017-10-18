class PackageInput < ApplicationRecord
  belongs_to :campaign_input
  belongs_to :agency
  belongs_to :publisher
  belongs_to :buy_method
  belongs_to :inventory_type
end
