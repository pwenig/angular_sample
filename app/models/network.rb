class Network < ApplicationRecord
  has_many :programs
  has_many :campaign_inputs
  validates_presence_of :name
  validates_uniqueness_of :name
  validates_presence_of :abbrev
  validates_uniqueness_of :abbrev
end
