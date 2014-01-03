module Jekyll
  require 'sass'
  class SassConverter < Converter
    safe true
    priority :low

    def matches(ext)
      ext =~ /.scss/i
    end

    def output_ext(ext)
      ".css"
    end

    def convert(content)
      puts "Working"
      begin
        converter = Sass::Engine.new(content, :load_paths => ["./sass/"], :css_location => "./css/")
        converter.render
      rescue StandardError => e
        puts "!!! SASS Error: " + e.message
      end
    end
  end
end
