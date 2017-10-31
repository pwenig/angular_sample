class PlacementInput < ApplicationRecord
  belongs_to :tactic
  belongs_to :device
  belongs_to :ad_type
  belongs_to :package_input
  belongs_to :targeting_type_1, class_name: 'TargetingType'
  belongs_to :targeting_type_2, class_name: 'TargetingType'
  belongs_to :targeting_type_3, class_name: 'TargetingType'
  belongs_to :targeting_type_4, class_name: 'TargetingType'
  belongs_to :episode_start, class_name: 'Episode'
  belongs_to :episode_end, class_name: 'Episode'
end
