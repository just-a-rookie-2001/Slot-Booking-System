import traceback
import logging


def timeToDecimal(time):
    try:
        (h, m, s) = str(time).split(":")
        return (int(h) + int(m) / 60)
    except Exception as e:
        logging.error(traceback.format_exc())


def timeFromDecimal(time):
    try:
        h = int(time)
        m = (time - h) * 60
        return str(h) + ":" + str(m)
    except Exception as e:
        logging.error(traceback.format_exc())


def convertTime(time):
    if (type(time) == type(0.0)):
        try:
            h = int(time)
            m = int((time - h) * 60)
            return str(h) + ":" + str(m)
        except Exception as e:
            logging.error(traceback.format_exc())
    elif (type(time) == type(" ")):
        try:
            (h, m, s) = (time).split(":")
            return (int(h) + int(m) / 60)
        except Exception as e:
            logging.error(traceback.format_exc())
