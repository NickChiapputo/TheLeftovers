PDF = pdflatex

REQS_DIR = Part\ 1/
REQS_NAME = $(REQS_DIR)Requirements
REQS_SRC = $(REQS_NAME).tex
REQS_OUT = $(REQS_NAME)
REQS_FLAGS = -halt-on-error -jobname=$(REQS_OUT)

USE_DIR = Part2/
USE_NAME = $(USE_DIR)UseCase
USE_SRC = $(USE_NAME).tex
USE_OUT = $(USE_NAME)
USE_FLAGS = -halt-on-error -jobname=$(USE_OUT)

usecase: cleanUse $(USE_SRC)
	$(PDF) $(USE_FLAGS) $(USE_SRC) && $(PDF) $(USE_FLAGS) $(USE_SRC) && make cleanUse

cleanUse: 
	rm -f $(USE_NAME).log $(USE_NAME).aux

reqs: cleanReqs $(REQS_SRC)
	$(PDF) $(REQS_FLAGS) $(REQS_SRC) && $(PDF) $(REQS_FLAGS) $(REQS_SRC) && make cleanReqs

cleanReqs:
	rm -f $(REQS_NAME).log $(REQS_NAME).aux
