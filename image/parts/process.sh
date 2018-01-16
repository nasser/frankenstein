convert "$1" -alpha extract "mask-$1"
convert "$1" -alpha Opaque +level-colors White "white-$1"
convert "white-$1" "mask-$1" \
          -alpha Off -compose CopyOpacity -composite \
          "out-$1"
convert "out-$1" -resize 10% "small-$1"