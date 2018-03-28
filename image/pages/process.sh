# convert "$1" -colorspace Gray "gray-$1"
# convert "gray-$1" -negate "mask-$1"
# convert "gray-$1" -alpha Opaque +level-colors Black "black-$1"
# convert "black-$1" "mask-$1" \
#           -alpha Off -compose CopyOpacity -composite \
#           "out-$1"
convert "$1" -resize 50% "$1"