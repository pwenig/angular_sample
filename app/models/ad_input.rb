class AdInput < ApplicationRecord
  belongs_to :placement_input
  belongs_to :creative_group
  has_many :creative_inputs
end
