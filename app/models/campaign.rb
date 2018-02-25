# This should probably be removed. 
class Campaign < ApplicationRecord
  validates_presence_of :name
  validates_presence_of :abbrev
  validates_uniqueness_of :name
  validates_uniqueness_of :abbrev
end
