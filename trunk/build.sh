#!/bin/sh
if [ $1 ]; then
	rm -rf target *.xpi
	svn export $1 target
	cd target
	rm -rf .settings .project
	zip -r9vT $1.xpi *
	mv $1.xpi ..
	cd ..
	rm -rf target
else
	echo "Informe o projeto"
fi