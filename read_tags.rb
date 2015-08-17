#!/usr/bin/ruby

# Count from 1 to 10 with a sleep
STDOUT.sync = true
(1..10).each do |count|
	puts count
	sleep(0.5)
end
