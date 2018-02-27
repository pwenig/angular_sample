class PlacementInput < ApplicationRecord
  after_initialize :set_placement_input_tag

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

  validates_presence_of :package_input
  validates_presence_of :tactic
  validates_presence_of :device
  validates_presence_of :ad_type
  validates_presence_of :targeting_type_1
  validates_presence_of :targeting_type_2
  validates_presence_of :targeting_type_3
  validates_presence_of :targeting_type_4

  private

  def tentpole_details_must_be_present
    return unless package_input.campaign_input.season.name == 'Tentpole' && tentpole_details.blank?
    errors.add(:tentpole_details, "can't be blank")
  end

  def episode_dates_must_be_present
    return unless package_input.campaign_input.season.name != 'Tentpole' &&
                  package_input.campaign_input.season.name != 'N/A' &&
                  episode_start_id.blank? &&
                  episode_end_id.blank?
    errors.add(:episode_start_id, "can't be blank")
    errors.add(:episode_end_id, "can't be blank")
  end


  def season_field
    package_input.campaign.tentpole? ? package_input.campaign.tentpole_details : "#{episode_start.abbrev}-#{episode_end.abbrev}"
  end

  def dimensions_field
    !ad_type.video? ? "#{width}x#{height}" : nil
  end

  def set_placement_input_tag
    if !self.placement_input_tag
      c = package_input.campaign_input
      self.placement_input_tag = [
        c.network.abbrev,
        c.program.abbrev,
        c.season.abbrev,
        season_field(),
        package_input.agency.abbrev,
        tactic.abbrev,
        device.abbrev,
        ad_type.abbrev,
        targeting_type_1.abbrev,
        targeting_type_2.abbrev,
        targeting_type_3.abbrev,
        targeting_type_4.abbrev,
        audience_type,
        dimensions_field(),
        "#{c.start_year}#{c.start_month.to_s.rjust(2,"0")}#{c.start_day.to_s.rjust(2,"0")}",
        "#{c.end_year}#{c.end_month.to_s.rjust(2,"0")}#{c.end_day.to_s.rjust(2,"0")}"
      ].compact().join("_")
    end
  end
end
