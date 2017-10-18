class MetadataService
  require 'json'

  def self.fetch_data
    metaobject = {}
    metaobject['networks'] = fetch_table_data(Network)
    metaobject['seasons'] = fetch_table_data(Season)
    metaobject['campaigns'] = fetch_table_data(Campaign)
    metaobject['campaign_types'] = fetch_table_data(CampaignType)
    metaobject['agencies'] = fetch_table_data(Agency)
    metaobject['buy_methods'] = fetch_table_data(BuyMethod)
    metaobject['publishers'] = fetch_table_data(Publisher)
    metaobject['inventory_types'] = fetch_table_data(InventoryType)
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
end
