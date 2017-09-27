Rails.application.routes.draw do
  namespace :admin do
    resources :users
    resources :agencies

    root to: "users#index"
  end

  devise_for :users

  # Cleaning up devise routes
  as :user do
    get 'signin' => 'pages#index'
    get 'invite' => 'devise/invitations#new'
    
   
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'pages#index'

  # Redirects routes to index if a wrong route is entered.
  get '*path' => redirect('/')

end
