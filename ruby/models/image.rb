class Image < ApplicationRecord
  mount_uploader :picture, ImageUploader
end
