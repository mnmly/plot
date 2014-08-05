build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components

plot.js:
	@component build --standalone plot \
		&& mv build/build.js $@ \
		&& rm -fr build

.PHONY: clean plot.js
