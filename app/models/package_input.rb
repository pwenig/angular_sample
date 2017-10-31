class PackageInput < ApplicationRecord
  belongs_to :campaign_input
  has_many :placement_inputs
  belongs_to :agency
  belongs_to :publisher
  belongs_to :buy_method
  belongs_to :inventory_type
end
