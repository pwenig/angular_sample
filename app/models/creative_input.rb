class CreativeInput < ApplicationRecord
  belongs_to :ad_input
  belongs_to :creative_message
  belongs_to :abtest_label
  belongs_to :video_length, optional: true

  validate :video_length_must_be_present

  def video_length_must_be_present
    return unless (ad_input.placement_input.ad_type.abbrev == 'NSV' ||
                   ad_input.placement_input.ad_type.abbrev == 'SVD') &&
                  video_length_id.blank?
    errors.add(:video_length_id, "can't be blank")
  end
end
