class Request < ApplicationRecord
  validates_presence_of :requestor
  validates_presence_of :brand
  validates_presence_of :dimension
  validates_presence_of :dimension_value
end 