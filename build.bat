REM @echo off
rm -rf target
svn export %1 target
cd target
rm -rf .settings
rm -rf sources
rm .project
zip -r -9 %1.xpi *
cd ..