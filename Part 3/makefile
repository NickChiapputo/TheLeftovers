PDF_SRC = Part3.tex
PDF_OUT = TheLeftovers_Part-3

.PHONY: clean

pdf: clean $(PDF_SRC)
	pdflatex -halt-on-error -jobname=$(PDF_OUT) $(PDF_SRC) && pdflatex -halt-on-error -jobname=$(PDF_OUT) $(PDF_SRC) && make clean

clean: 
	rm -f *.aux *.log
