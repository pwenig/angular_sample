class PlacementInput < ApplicationRecord
  belongs_to :tactic
  belongs_to :device
  belongs_to :ad_type
  belongs_to :package_input
  belongs_to :targeting_type_1, class_name: 'TargetingType'
  belongs_to :targeting_type_2, class_name: 'TargetingType'
  belongs_to :targeting_type_3, class_name: 'TargetingType'
  belongs_to :targeting_type_4, class_name: 'TargetingType'
  belongs_to :episode_start, class_name: 'Episode', optional: true
  belongs_to :episode_end, class_name: 'Episode', optional: true
  has_many :ad_inputs, dependent: :delete_all

  validate :tentpole_details_must_be_present
  validate :episode_dates_must_be_present

  def tentpole_details_must_be_present
    return unless package_input.campaign_input.season.name == 'Tentpole' && tentpole_details.blank?
    errors.add(:tentpole_details, "can't be blank")
  end

  def episode_dates_must_be_present
    return unless package_input.campaign_input.season.name != 'Tentpole' &&
                  episode_start_id.blank? &&
                  episode_end_id.blank?
    errors.add(:episode_start_id, "can't be blank")
    errors.add(:episode_end_id, "can't be blank")
  end
end
