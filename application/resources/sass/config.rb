# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)

# Load the sencha-touch framework automatically.
load File.join(dir, '..', '..', 'touch', 'resources', 'themes')

# Compass configurations
# **See**: http://compass-style.org/help/tutorials/configuration-reference/
relative_assets = true
sass_path = dir
css_path = File.join(dir, "..", "css")
fonts_dir = File.join("..", "fonts")
images_dir = File.join('images')

# Require any additional compass plugins here.
output_style = :compressed
environment = :production
