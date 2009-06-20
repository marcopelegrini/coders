@echo off
del creditCardGenerator.xpi
del chrome/creditCardGenerator.jar
cd chrome
zip -r creditCardGenerator.jar *
cd ..
zip -r creditCardGenerator.xpi *