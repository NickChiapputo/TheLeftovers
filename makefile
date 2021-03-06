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

CLASS_DIR = Part2/
CLASS_NAME = $(CLASS_DIR)ClassDiagram
CLASS_SRC = $(CLASS_NAME).tex
CLASS_OUT = $(CLASS_NAME)
CLASS_FLAGS = -halt-on-error -jobname=$(CLASS_OUT)

classDiagram: cleanClassDiagram $(CLASS_SRC)
	$(PDF) $(CLASS_FLAGS) $(CLASS_SRC) && $(PDF) $(CLASS_FLAGS) $(CLASS_SRC) && make cleanClassDiagram

cleanClassDiagram: 
	rm -f $(CLASS_NAME).log $(CLASS_NAME).aux

usecase: cleanUse $(USE_SRC)
	$(PDF) $(USE_FLAGS) $(USE_SRC) && $(PDF) $(USE_FLAGS) $(USE_SRC) && make cleanUse

cleanUse: 
	rm -f $(USE_NAME).log $(USE_NAME).aux

reqs: cleanReqs $(REQS_SRC)
	$(PDF) $(REQS_FLAGS) $(REQS_SRC) && $(PDF) $(REQS_FLAGS) $(REQS_SRC) && make cleanReqs

cleanReqs:
	rm -f $(REQS_NAME).log $(REQS_NAME).aux
