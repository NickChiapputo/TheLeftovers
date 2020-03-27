PDF = pdflatex

UPD_NAME = Weekly Update - 3/27
UPD_SRC = update.tex
UPD_OUT = $(UPD_NAME)
UPD_FLAG = -halt-on-error -jobname=$(UPD_OUT)

pdf: clean $(UPD_SRC)
	$(PDF) $(UPD_FLAGS) $(UPD_SRC) && $(PDF) $(UPD_FLAGS) $(UPD_SRC) && make clean

clean:
	rm -f $(UPD_NAME).log $(UPD_NAME).aux
