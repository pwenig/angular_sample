class CampaignInput < ApplicationRecord
  after_initialize :set_campaign_input_tag

  belongs_to :program
  belongs_to :network
  belongs_to :season
  belongs_to :campaign_type
  has_many :package_inputs, dependent: :delete_all

  validates_presence_of :program
  validates_presence_of :network
  validates_presence_of :season
  validates_presence_of :campaign_type

  def tentpole?
    season&.abbrev == 'TPL' || season&.abbrev == 'X'
  end

  def season?
    !tentpole? && season&.name != 'N/A'
  end
  private

  # if namestring is not provided, this will create it based upon the
  # relationships. Otherwise, this relies on client to set namestring correctly.
  def set_campaign_input_tag
    if !campaign_input_tag
      self.campaign_input_tag = [
        network.abbrev,
        program.abbrev,
        season.abbrev,
        campaign_type.abbrev,
        custom,
        "#{start_year}#{start_month.to_s.rjust(2,"0")}#{start_day.to_s.rjust(2,"0")}",
        "#{end_year}#{end_month.to_s.rjust(2,"0")}#{end_day.to_s.rjust(2,"0")}"
      ].join("_")
    end
  end
end
