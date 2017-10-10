class Program < ApplicationRecord
  belongs_to :network
  has_many :campaign_inputs
  validates_presence_of :name
  validates_uniqueness_of :name, scope: :network_id
  validates_presence_of :abbrev
  validates_uniqueness_of :abbrev, scope: :network_id
  validates_presence_of :network
end
