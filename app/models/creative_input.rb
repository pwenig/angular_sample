class CreativeInput < ApplicationRecord
  after_initialize :set_creative_input_tag

  belongs_to :ad_input
  belongs_to :creative_message
  belongs_to :abtest_label
  belongs_to :video_length, optional: true

  validate :video_length_must_be_present


  private

  def video_length_must_be_present
    return unless (ad_input.placement_input.ad_type.abbrev == 'NSV' ||
                   ad_input.placement_input.ad_type.abbrev == 'SVD') &&
                  video_length_id.blank?
    errors.add(:video_length_id, "can't be blank")
  end

  def set_creative_input_tag
    if !self.creative_input_tag
      c = ad_input.placement_input.package_input.campaign_input
      self.creative_input_tag = [
        c.network.abbrev,
        c.program.abbrev,
        c.season.abbrev,
        ad_input.creative_group.abbrev,
        creative_message.abbrev,
        custom,
        creative_version_number,
        abtest_label ? abtest_label.abbrev : '',
        "#{ad_input.placement_input.width}#{ad_input.placement_input.height}",
        "#{c.start_year}#{start_month.to_s.rjust(2,"0")}#{start_day.to_s.rjust(2,"0")}",
        "#{c.end_year}#{end_month.to_s.rjust(2,"0")}#{end_day.to_s.rjust(2,"0")}"
      ].join('_')
    end
  end
end
