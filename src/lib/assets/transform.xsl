<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:tei="http://www.tei-c.org/ns/1.0"
  xmlns:html="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="tei html">
  <xsl:output method="html" indent="yes" />

  <xsl:template name="tei-class">
    <xsl:attribute name="class">
      <xsl:value-of select="concat('tei-', local-name())" />
    </xsl:attribute>
  </xsl:template>


  <!-- Identity template: copies all nodes and attributes -->
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()" />
    </xsl:copy>
  </xsl:template>

  <!-- Add a class attribute with the original TEI tag name -->
  <xsl:template match="*">
    <xsl:element name="{local-name()}">
      <xsl:call-template name="tei-class" />
      <xsl:apply-templates select="@*|node()" />
    </xsl:element>
  </xsl:template>

  <!-- <sp> to <p> -->
  <xsl:template match="tei:sp">
    <p>
      <xsl:call-template name="tei-class" />
      <xsl:apply-templates select="@*|node()" />
    </p>
  </xsl:template>

  <!-- <emph> to <em> -->
  <xsl:template match="tei:emph">
    <em>
      <xsl:call-template name="tei-class" />
      <xsl:apply-templates select="@*|node()" />
    </em>
  </xsl:template>

  <!-- <speaker> to <span> -->
  <xsl:template match="tei:speaker|tei:p|tei:titlePart">
    <span>
      <xsl:call-template name="tei-class" />
      <xsl:apply-templates select="@*|node()" />
    </span>
  </xsl:template>

  <xsl:template match="tei:castList">
    <xsl:call-template name="tei-class" />
    <xsl:if test="tei:head">
      <p>
        <em>
          <xsl:for-each select="tei:head">
            <xsl:apply-templates />
          </xsl:for-each>
        </em>
      </p>
    </xsl:if>
    <ul>
      <xsl:apply-templates />
    </ul>
  </xsl:template>

  <!-- <castList> to an unordered list  -->
  <xsl:template match="tei:castList">
    <strong>
      <xsl:call-template name="tei-class" />
      <xsl:value-of select="tei:head" />
    </strong>
    <ul>
      <xsl:call-template name="tei-class" />
      <xsl:apply-templates select="tei:castItem" />
    </ul>
  </xsl:template>
  <xsl:template match="tei:castItem">
    <li>
      <xsl:call-template name="tei-class" />
      <xsl:apply-templates select="node()" />
    </li>
  </xsl:template>

  <!-- <set> to <div> -->
  <xsl:template match="tei:set">
    <div>
      <xsl:call-template name="tei-class" />
      <xsl:apply-templates select="@*|node()" />
    </div>
  </xsl:template>


</xsl:stylesheet>

