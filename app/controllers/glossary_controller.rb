class GlossaryController < ApplicationController

  def index
    @networks = Network.order(:name)
    @programs = Program.order(:name)
    @seasons = Season.order(:name)
    @campaign_types = CampaignType.order(:name)
    @publishers = Publisher.order(:name)
    @buy_methods = BuyMethod.order(:name)
    @inventory_types = InventoryType.order(:name)
    @episodes = Episode.order(:name)
    @tactics = Tactic.order(:name)
    @ad_types = AdType.order(:name)
    @devices = Device.order(:name)
    @targeting_types = TargetingType.order(:name)
    @video_lengths = VideoLength.order(:name)
    @creative_groups = CreativeGroup.order(:name)
    @creative_messages = CreativeMessage.order(:name)
    @abtest_labels = AbtestLabel.order(:name)
  end
end
