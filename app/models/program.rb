class Program < ApplicationRecord
  belongs_to :network
  validates_presence_of :network
end
