class CreativeInputsController < ApplicationController
  def index
    @creative_inputs = CreativeInput.all
    render json: @creative_inputs,
           except: %i[ad_input_id creative_message_id abtest_label_id video_length_id],
           include: [{ ad_input: { include: { placement_input: { include: { package_input: { include:
                    [:publisher, { campaign_input: { include: %i[network program season] } }] } } } } } },
                     :creative_message, :abtest_label, :video_length],
           status: 200
  end

  def create
    @creative_input = CreativeInput.includes(:ad_input, :creative_message,
                                             :abtest_label, :video_length)
                                   .find_by(creative_input_tag: params['creative_input_tag'])
    if @creative_input
      render json: @creative_input,
             except: %i[ad_input_id creative_message_id abtest_label_id video_length_id],
             include: [{ ad_input: { include: { placement_input: { include: { package_input: { include:
                      [:publisher, { campaign_input: { include: %i[network program season] } }] } } } } } },
                       :creative_message, :abtest_label, :video_length],
             status: 200
    else
      @creative_input = CreativeInput.includes(:ad_input, :creative_message,
                                               :abtest_label, :video_length).create!(permitted_params)
      render json: @creative_input,
             except: %i[ad_input_id creative_message_id abtest_label_id video_length_id],
             include: [{ ad_input: { include: { placement_input: { include: { package_input: { include:
                      [:publisher, { campaign_input: { include: %i[network program season] } }] } } } } } },
                       :creative_message, :abtest_label, :video_length], status: 201
    end
  end

  def show
    @creative_input = CreativeInput.includes(:ad_input, :creative_message,
                                             :abtest_label, :video_length).find_by(creative_input_tag: params[:id])
    if @creative_input
      render json: @creative_input,
             except: %i[ad_input_id creative_message_id abtest_label_id video_length_id],
             include: [{ ad_input: { include: { placement_input: { include: { package_input: { include:
                      [:publisher, { campaign_input: { include: %i[network program season] } }] } } } } } },
                       :creative_message, :abtest_label, :video_length], status: 200
    else
      head :no_content
    end
  end

  private

  def permitted_params
    params.permit(:ad_input_id, :creative_message_id, :abtest_label_id,
                  :video_length_id, :start_year, :start_month, :start_day, :end_year, :end_month,
                  :end_day, :creative_input_tag, :custom,
                  :creative_version_number)
  end
end
