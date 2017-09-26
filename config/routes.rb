Rails.application.routes.draw do
  devise_for :users

  # Cleaning up devise routes
  as :user do
    get 'signin' => 'pages#index'
    get 'register' => 'devise/registrations#new'
   
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'pages#index'

  # Redirects routes to index if a wrong route is entered.
  get '*path' => redirect('/')

end
