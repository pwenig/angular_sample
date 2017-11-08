class MetadataService
  require 'json'

  def self.fetch_data
    metaobject = {
      networks: fetch_table_data(Network), seasons: fetch_table_data(Season),
      campaigns: fetch_table_data(Campaign), campaign_types: fetch_table_data(CampaignType),
      agencies: fetch_table_data(Agency), buy_methods: fetch_table_data(BuyMethod),
      publishers: fetch_table_data(Publisher), inventory_types: fetch_table_data(InventoryType),
      ad_types: fetch_table_data(AdType), targeting_types: fetch_table_data(TargetingType),
      tactics: fetch_table_data(Tactic), devices: fetch_table_data(Device), episodes: fetch_table_data(Episode),
      creative_groups: fetch_table_data(CreativeGroup), creative_messages: fetch_table_data(CreativeMessage),
      abtest_labels: fetch_table_data(AbtestLabel), video_lengths: fetch_table_data(VideoLength),
      campaign_tags: fetch_campaign_tags
    }
    metaobject
  end

  def self.fetch_table_data(table)
    if table == Network
      Network.all.includes(:programs).as_json(
        except: %i[created_at updated_at],
        include: { programs: { except: %i[created_at updated_at network_id] } }
      )
    else
      table.all.as_json(
        except: %i[created_at updated_at]
      )
    end
  end

  # Get the campaign input tags for searching
  def self.fetch_campaign_tags
    CampaignInput.all.map { |x| x['campaign_input_tag'] }.as_json
  end
end
