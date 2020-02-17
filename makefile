PDF = pdflatex

REQS_DIR = Part\ 1/
REQS_NAME = $(REQS_DIR)Requirements
REQS_SRC = $(REQS_NAME).tex
REQS_OUT = $(REQS_NAME)
REQS_FLAGS = -halt-on-error -jobname=$(REQS_OUT)

reqs: cleanReqs $(REQS_SRC)
	$(PDF) $(REQS_FLAGS) $(REQS_SRC) && $(PDF) $(REQS_FLAGS) $(REQS_SRC) && make cleanReqs

cleanReqs:
	rm -f $(REQS_NAME).log $(REQS_NAME).aux
