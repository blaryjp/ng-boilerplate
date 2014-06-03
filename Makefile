all:
	@echo "Hi!"

install:
	rm -rf components/
	rm -rf bower_components/
	rm -rf node_modules/
	rm -rf vendor/
	npm install
	bower install

dev:
	grunt dev

