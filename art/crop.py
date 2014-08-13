#!/usr/bin/env python
import sys
from os.path import splitext


name=sys.argv[1]
coords=[
(0,0),
(96,0),
(192,0),
(288,0),
(0,128),
(96,128),
(192,128),
(288,128)]
i=1
for c in coords:
    print "convert %s -crop 96x128+%d+%d +repage %s%d.png" % (name, c[0], c[1], splitext(name)[0], i)
    i+=1
