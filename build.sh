#!/bin/bash

# Function to build an application
# Arguments:
# $1 - Source directory (relative to script's location)
# $2 - Build command
# $3 - Name of the application
build_app() {
  src="$1"
  build_command="$2"
  name="$3"

  echo "Building $name..."
  cd "$src"
  npm install --legacy-peer-deps
  npm run "$build_command"
  cd -
}

# Function to copy built files if 'dist' directory exists
# Arguments:
# $1 - Source directory (relative to script's location)
# $2 - Name of the application
copy_dist() {
  src="$1"
  name="$2"

  if [ -d "$src/dist" ]; then
    echo "Copying $name build..."
    cp -r "$src/dist/." "dist/$name"
  else
    echo "Error: $name build failed or 'dist' directory not found."
  fi
}

copy_dist_root() {
  src="$1"
  name="$2"

  if [ -d "$src/dist" ]; then
    echo "Copying $name build..."
    cp -r "$src/dist/." "dist"
  else
    echo "Error: $name build failed or 'dist' directory not found."
  fi
}

# Clear and create a new 'dist' directory in the root
rm -rf dist
mkdir -p dist

npm install --legacy-peer-deps

# Build each application and move their 'dist' contents to root 'dist' directory
build_app "packages/app1" "build" "app1"

build_app "packages/app2" "build" "app2"

build_app "packages/core-ui" "build" "app3"

copy_dist "packages/app1" "app1"
copy_dist "packages/app2" "app2"
copy_dist_root "packages/core-ui" "app3"

echo "Build process completed."
